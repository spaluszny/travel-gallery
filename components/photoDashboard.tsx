"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────

type Photo = {
  photo_id: number;
  photo_url: string;
  continent: string | null;
  country: string | null;
  state: string | null;
  photo_date: string | null;
  description: string | null;
  camera_make: string | null;
  camera_model: string | null;
  filename: string;
  active: boolean;
  show_on_map: boolean;
  taken_by: string | null;
  tags: string[] | null;
  lat: string | null;
  lng: string | null;
};

type EditFields = Pick<
  Photo,
  | "continent"
  | "country"
  | "state"
  | "description"
  | "taken_by"
  | "active"
  | "show_on_map"
>;

// ── Supabase client (public anon key — read-only from the browser) ────────────
// If you already have a shared client, import that instead.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 15;

const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(raw: string | null) {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function locationLabel(photo: Photo) {
  return [photo.state, photo.country].filter(Boolean).join(", ") || "—";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700" />
    </div>
  );
}

function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-stone-100 text-stone-500 ring-1 ring-stone-200"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </span>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({
  photo,
  onClose,
  onSave,
}: {
  photo: Photo;
  onClose: () => void;
  onSave: (id: number, fields: EditFields) => Promise<void>;
}) {
  const [fields, setFields] = useState<EditFields>({
    continent: photo.continent,
    country: photo.country,
    state: photo.state,
    description: photo.description,
    taken_by: photo.taken_by,
    active: photo.active,
    show_on_map: photo.show_on_map,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(photo.photo_id, fields);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-stone-100 p-6">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={photo.photo_url}
              alt={photo.description ?? photo.filename}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-stone-800">
              {photo.description ?? photo.filename}
            </p>
            <p className="mt-0.5 text-sm text-stone-500">
              {formatDate(photo.photo_date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {(
            [
              ["continent", "Continent"],
              ["country", "Country"],
              ["state", "Location / State"],
              ["taken_by", "Taken By"],
            ] as [keyof EditFields, string][]
          ).map(([key, label]) => (
            <div key={key} className={key === "state" || key === "taken_by" ? "col-span-2" : ""}>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">
                {label}
              </label>
              {key === "continent" ? (
                <select
                  value={fields.continent ?? ""}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, continent: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none"
                >
                  <option value="">— None —</option>
                  {CONTINENTS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={(fields[key] as string | null) ?? ""}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, [key]: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none"
                />
              )}
            </div>
          ))}

          {/* Description — full width */}
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">
              Description
            </label>
            <textarea
              rows={3}
              value={fields.description ?? ""}
              onChange={(e) =>
                setFields((f) => ({ ...f, description: e.target.value || null }))
              }
              className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="col-span-2 flex items-center gap-6 pt-1">
            {(
              [
                ["active", "Active / Visible"],
                ["show_on_map", "Show on Map"],
              ] as [keyof EditFields, string][]
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <div
                  onClick={() =>
                    setFields((f) => ({ ...f, [key]: !f[key as keyof EditFields] }))
                  }
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    fields[key] ? "bg-emerald-500" : "bg-stone-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      fields[key] ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-stone-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-stone-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({
  photo,
  onClose,
  onConfirm,
}: {
  photo: Photo;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-stone-200">
        <h2 className="text-base font-semibold text-stone-800">Delete photo?</h2>
        <p className="mt-2 text-sm text-stone-500">
          <span className="font-medium text-stone-700">
            {photo.description ?? photo.filename}
          </span>{" "}
          will be permanently deleted from both the database and S3. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PhotoDashboardTable() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterContinent, setFilterContinent] = useState("");
  const [filterActive, setFilterActive] = useState<"" | "true" | "false">("");

  // Modals
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<Photo | null>(null);

  // Track previous filter values to detect changes and reset page
  const prevFilters = useRef({ filterContinent, filterActive, search });

  // Stable fetch that accepts the page to use, avoiding stale closure issues
  const fetchPhotos = useCallback(async (activePage: number) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("photos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(activePage * PAGE_SIZE, activePage * PAGE_SIZE + PAGE_SIZE - 1);

    if (filterContinent) query = query.eq("continent", filterContinent);
    if (filterActive !== "") query = query.eq("active", filterActive === "true");
    if (search.trim()) {
      const s = `%${search.trim()}%`;
      query = query.or(
        `description.ilike.${s},country.ilike.${s},state.ilike.${s},filename.ilike.${s}`
      );
    }

    const { data, count, error: err } = await query;

    if (err) {
      setError(err.message);
    } else {
      setPhotos((data as Photo[]) ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [filterContinent, filterActive, search]);

  useEffect(() => {
    const filtersChanged =
      prevFilters.current.filterContinent !== filterContinent ||
      prevFilters.current.filterActive !== filterActive ||
      prevFilters.current.search !== search;

    prevFilters.current = { filterContinent, filterActive, search };

    if (filtersChanged) {
      // Filters changed: reset to page 0 and fetch from there
      setPage(0);
      fetchPhotos(0);
    } else {
      fetchPhotos(page);
    }
  }, [page, filterContinent, filterActive, search, fetchPhotos]);

  // Actions
  const handleDelete = async () => {
    if (!deletePhoto) return;
    const res = await fetch("/api/delete-photo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoId: deletePhoto.photo_id,
        s3Key: deletePhoto.s3_key,
      }),
    });
    if (res.ok) {
      setDeletePhoto(null);
      fetchPhotos(page);
    }
  };

  const handleSave = async (id: number, fields: EditFields) => {
    const res = await fetch("/api/update-photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: id, fields }),
    });
    if (res.ok) fetchPhotos(page);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      {/* ── Filters ── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search description, country, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-700 placeholder-stone-400 focus:border-stone-400 focus:outline-none"
          />
        </div>

        {/* Continent filter */}
        <select
          value={filterContinent}
          onChange={(e) => setFilterContinent(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none"
        >
          <option value="">All Continents</option>
          {CONTINENTS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Active filter */}
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value as "" | "true" | "false")}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Hidden</option>
        </select>

        {/* Result count */}
        <span className="ml-auto text-sm text-stone-400">
          {total} photo{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        ) : photos.length === 0 ? (
          <p className="py-10 text-center text-sm text-stone-400">No photos found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Continent
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
                    Location
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 md:table-cell">
                    Date
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 lg:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {photos.map((photo) => (
                  <tr
                    key={photo.photo_id}
                    className="group transition-colors hover:bg-stone-50"
                  >
                    {/* Thumbnail + description */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200">
                          <Image
                            src={photo.photo_url}
                            alt={photo.description ?? photo.filename}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-medium text-stone-800">
                            {photo.description ?? (
                              <span className="italic text-stone-400">No description</span>
                            )}
                          </p>
                          <p className="truncate text-xs text-stone-400">{photo.filename}</p>
                        </div>
                      </div>
                    </td>

                    {/* Continent */}
                    <td className="px-4 py-3 text-stone-600">
                      {photo.continent ?? "—"}
                    </td>

                    {/* Location */}
                    <td className="hidden px-4 py-3 text-stone-600 sm:table-cell">
                      {locationLabel(photo)}
                    </td>

                    {/* Date */}
                    <td className="hidden px-4 py-3 text-stone-500 md:table-cell">
                      {formatDate(photo.photo_date)}
                    </td>

                    {/* Status */}
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <Badge active={photo.active} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditPhoto(photo)}
                          title="Edit"
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-500 ring-1 ring-stone-200 transition hover:bg-stone-100 hover:text-stone-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletePhoto(photo)}
                          title="Delete"
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 ring-1 ring-red-100 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-stone-400">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="rounded-lg px-2.5 py-1.5 text-sm text-stone-500 transition hover:bg-stone-100 disabled:opacity-30"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="rounded-lg px-3 py-1.5 text-sm text-stone-500 transition hover:bg-stone-100 disabled:opacity-30"
            >
              ‹ Prev
            </button>

            {/* Page number pills */}
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter((i) => Math.abs(i - page) <= 2)
              .map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    i === page
                      ? "bg-stone-800 text-white"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg px-3 py-1.5 text-sm text-stone-500 transition hover:bg-stone-100 disabled:opacity-30"
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg px-2.5 py-1.5 text-sm text-stone-500 transition hover:bg-stone-100 disabled:opacity-30"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {editPhoto && (
        <EditModal
          photo={editPhoto}
          onClose={() => setEditPhoto(null)}
          onSave={handleSave}
        />
      )}
      {deletePhoto && (
        <DeleteModal
          photo={deletePhoto}
          onClose={() => setDeletePhoto(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}