import { EventWithRelations } from "@/lib/events";
import { format } from "date-fns";

type PastEventsSectionProps = {
  events: EventWithRelations[];
};

export function PastEventsSection({ events }: PastEventsSectionProps) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Past highlights
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Recent events from this country
            </h2>
            <p className="text-slate-600 mt-2">
              A quick view of sessions that already happened in this region.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-xs font-semibold text-primary mb-2">
                {format(new Date(event.startDate), "MMM d, yyyy")}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                {event.description ||
                  "Event completed. Recording and highlights are coming soon."}
              </p>
              <dl className="mt-4 space-y-1 text-sm text-slate-700">
                {event.location && (
                  <div className="flex gap-2">
                    <dt className="font-medium">Location:</dt>
                    <dd className="text-slate-600">{event.location}</dd>
                  </div>
                )}
                {event.destination && (
                  <div className="flex gap-2">
                    <dt className="font-medium">Destination:</dt>
                    <dd className="text-slate-600">{event.destination.name}</dd>
                  </div>
                )}
                {event.university && (
                  <div className="flex gap-2">
                    <dt className="font-medium">University:</dt>
                    <dd className="text-slate-600">{event.university.name}</dd>
                  </div>
                )}
              </dl>
              {event.successSummary && (
                <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                  {event.successSummary}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
