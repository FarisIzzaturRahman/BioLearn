'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Loader2, FilePlus2, AlertCircle } from 'lucide-react';

export default function NewCoursePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [estimatedHours, setEstimatedHours] = useState<number>(8);
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word characters
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!title.trim() || !slug.trim()) {
      setErrorMsg('Title and Slug are required fields.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          title,
          slug,
          description: description.trim() || null,
          level,
          estimated_hours: estimatedHours,
          cover_image: coverImage.trim() || null,
          published,
        });

      if (error) throw error;

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create course. Ensure slug is unique.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">

      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <FilePlus2 className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-extrabold text-gray-900">Create New Course</h1>
      </div>

      {/* Form Container */}
      <div className="border border-gray-200 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error creating course: </span>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Biology Crash Course for Programmers"
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Slug input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Slug (Auto-generated)</label>
            <input
              type="text"
              required
              placeholder="e.g., biology-crash-course-for-programmers"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
            <textarea
              rows={4}
              placeholder="Summarize course content and learning paths..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition leading-relaxed"
            />
          </div>

          {/* Level & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Estimated Duration (Hours)</label>
              <input
                type="number"
                min={1}
                required
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or blank"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between border border-gray-200 bg-gray-50/50 rounded-xl p-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Publish Immediately</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Toggle to make this course visible in the catalog layout.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition duration-150 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  Save Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
