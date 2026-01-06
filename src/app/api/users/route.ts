import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleUpdate, handleDelete } from "@/lib/api-helpers";
import bcrypt from "bcrypt";
import { getSession, canManageUsers, forbiddenResponse, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  // Check if user is authenticated
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  // Only SUPERADMIN can list users
  if (!canManageUsers(session)) {
    return forbiddenResponse("Only SUPERADMIN can manage users");
  }

  return handleGetMany(req, prisma.user, {
    searchFields: ["name", "email"],
    defaultSort: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password
    },
  });
}

export async function POST(req: NextRequest) {
  // Check if user is authenticated
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  // Only SUPERADMIN can create users
  if (!canManageUsers(session)) {
    return forbiddenResponse("Only SUPERADMIN can create users");
  }

  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return Response.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["SUPERADMIN", "ADMIN", "MANAGER"];
    if (role && !validRoles.includes(role)) {
      return Response.json(
        { error: "Invalid role. Must be SUPERADMIN, ADMIN, or MANAGER" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Check if user is authenticated
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await req.json();
  const { id, password, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  // Users can update their own profile, SUPERADMIN can update anyone
  if (id !== session.id && !canManageUsers(session)) {
    return forbiddenResponse("You can only update your own profile");
  }

  // Only SUPERADMIN can change roles
  if (data.role && !canManageUsers(session)) {
    return forbiddenResponse("Only SUPERADMIN can change user roles");
  }

  // Hash password if provided
  if (password) {
    data.password = await bcrypt.hash(password, 12);
  }

  return handleUpdate(id, data, prisma.user, {
    revalidatePaths: ["/dashboard/settings"],
  });
}

export async function DELETE(req: NextRequest) {
  // Check if user is authenticated
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  // Only SUPERADMIN can delete users
  if (!canManageUsers(session)) {
    return forbiddenResponse("Only SUPERADMIN can delete users");
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  // Prevent deleting yourself
  if (id === session.id) {
    return Response.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  return handleDelete(id, prisma.user, {
    revalidatePaths: ["/dashboard/settings"],
  });
}
