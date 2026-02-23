"use client";

import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  startOfDay,
  parseISO
} from "date-fns";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { PageHeader } from "@/components/dashboard/page-header";
import { MeetingModal } from "@/components/dashboard/meeting-modal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Meeting {
  _id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  attendees: string[];
  status: "scheduled" | "completed" | "cancelled";
}

export default function CalendarsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { items: meetings, isLoading, create, update, remove } = useCrud<Meeting>("/api/meetings");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Meeting | null>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleDayClick = (day: Date) => {
    setEditingItem({
      title: "",
      description: "",
      startTime: startOfDay(day).toISOString(),
      endTime: addDays(startOfDay(day), 0.04).toISOString(), // ~1 hour
      attendees: [],
      status: "scheduled",
    });
    setModalOpen(true);
  };

  const handleEditMeeting = (e: React.MouseEvent, meeting: Meeting) => {
    e.stopPropagation();
    setEditingItem(meeting);
    setModalOpen(true);
  };

  const calendarGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }
    return rows;
  }, [currentMonth]);

  const meetingsByDay = useMemo(() => {
    const map: Record<string, Meeting[]> = {};
    meetings.forEach((m) => {
      const dateKey = format(parseISO(m.startTime), "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(m);
    });
    // Sort meetings by time
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });
    return map;
  }, [meetings]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        icon={CalendarIcon}
        title="Calendar"
        description="Schedule and manage your meetings"
        action={
          <Button onClick={() => { setEditingItem(null); setModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
          </Button>
        }
      />

      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground min-w-[200px]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday} className="h-8 px-3 text-xs font-medium">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/50" />
                Scheduled
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                Completed
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                Cancelled
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] overflow-hidden bg-card rounded-xl border border-border shadow-sm">
        <div className="grid grid-cols-7 border-b border-border bg-muted/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="flex flex-col h-full divide-y divide-border">
          {calendarGrid.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7 flex-1 min-h-[120px] divide-x divide-border">
              {week.map((day, dIdx) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayMeetings = meetingsByDay[dateKey] || [];
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={dIdx}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "p-2 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col gap-1 relative",
                      !isCurrentMonth && "bg-muted/10 opacity-40",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                      isToday ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70",
                      !isCurrentMonth && "text-muted-foreground"
                    )}>
                      {format(day, "d")}
                    </span>

                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                      {dayMeetings.map((m) => (
                        <div
                          key={m._id}
                          onClick={(e) => handleEditMeeting(e, m)}
                          className={cn(
                            "group px-2 py-1 rounded text-[10px] font-medium truncate flex items-center gap-1 transition-all hover:scale-[1.02] border",
                            m.status === "scheduled" && "bg-primary/10 text-primary border-primary/20",
                            m.status === "completed" && "bg-green-500/10 text-green-600 border-green-500/20",
                            m.status === "cancelled" && "bg-red-500/10 text-red-600 border-red-500/20"
                          )}
                        >
                          <span className="font-bold opacity-70">
                            {format(parseISO(m.startTime), "HH:mm")}
                          </span>
                          <span className="truncate">{m.title}</span>
                          {m.meetingLink && <Video className="h-2 w-2 ml-auto opacity-70" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <MeetingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        onSuccess={() => {}}
        create={create}
        update={update}
      />
    </div>
  );
}
