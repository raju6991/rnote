import { useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const allTags = [...new Set(notes.flatMap((note) => note.tags || []))];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            className="input input-bordered flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {allTags.length > 0 && (
            <select
              className="select select-bordered"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {filteredNotes.length === 0 && !isRateLimited && notes.length > 0 && (
          <div className="text-center py-10">
            <p className="text-lg">No notes match your search/filter</p>
            <button className="btn btn-ghost mt-2" onClick={() => {
              setSearchQuery("");
              setSelectedTag("");
            }}>
              Clear filters
            </button>
          </div>
        )}

        {filteredNotes.length === 0 && !isRateLimited && notes.length === 0 && <NotesNotFound />}

        {filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
