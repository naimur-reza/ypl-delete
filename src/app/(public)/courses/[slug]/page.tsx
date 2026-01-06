import { prisma } from "@/lib/prisma";

const CourseDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const course = await prisma.course.findUnique({
        where: {
            slug: (await params).slug,
        },
    });

    console.log({course})
    return (
        <div>
            <h1>{course?.title}</h1>
        </div>
    );
};


export default CourseDetailsPage;