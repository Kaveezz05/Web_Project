import React, { useEffect, useState } from "react";
import formatLKR from "../../lib/formatLKR";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const res = await fetch("http://localhost/vistalite/admin-auth.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) navigate("/login");
      else fetchShows();
    };

    init();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await fetch("http://localhost/vistalite/getshows.php");
      const data = await res.json();
      if (data.success) setShows(data.shows);
    } catch (err) {
      toast.error("Error loading shows");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (show_id, movie_id) => {
    toast(
      (t) => (
        <div className="text-black">
          <p>Are you sure you want to delete this show?</p>
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch("http://localhost/vistalite/delete.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ show_id, movie_id }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    fetchShows();
                    toast.success("Show deleted successfully");
                  } else {
                    toast.error(data.error || "Delete failed");
                  }
                } catch {
                  toast.error("Server error");
                }
              }}
              className="bg-red-500 px-4 py-1 rounded text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 px-4 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const handleEdit = async () => {
    if (!editModal?.id || !editModal?.movie_id) {
      toast.error("Missing movie or show ID");
      return;
    }

    const formData = new URLSearchParams({
      show_id: editModal.id,
      movie_id: editModal.movie_id,
      show_datetime: editModal.show_datetime.replace("T", " "),
      show_price: editModal.show_price,
    });

    try {
      const res = await fetch("http://localhost/vistalite/edit.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setEditModal(null);
        fetchShows();
        toast.success("Updated successfully");
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const openEditModal = (show) => {
    setEditModal({
      id: show.id,
      movie_id: show.movie_id,
      movie_title: show.movie_title,
      show_datetime: show.show_datetime.replace(" ", "T"),
      show_price: show.show_price,
    });
  };

  return (
    <div className="relative px-6 md:px-10 pb-10 text-[#E5E9F0] min-h-[80vh]">
      <Toaster />
      <BlurCircle top="60px" left="-60px" />
      <BlurCircle bottom="-40px" right="-60px" />
      <Title text1="List" text2="Shows" />

      {loading ? (
        <Loading />
      ) : shows.length === 0 ? (
        <p className="text-white mt-6">No shows found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left text-gray-200 bg-[#111827] border border-[#2f3542] rounded-lg overflow-hidden">
            <thead className="text-xs uppercase bg-[#1f2937] text-gray-400">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Movie</th>
                <th className="px-4 py-4">Show Date</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...shows]
                .filter((s) => new Date(s.show_datetime) >= new Date())
                .sort((a, b) => new Date(a.show_datetime) - new Date(b.show_datetime))
                .map((show, index) => (
                  <tr key={show.id} className="border-t border-[#2f3542]">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{show.movie_title}</td>
                    <td className="px-4 py-4">
                      {new Date(show.show_datetime).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">{formatLKR(show.show_price)}</td>
                    <td className="px-4 py-4">{dateFormat(show.created_at)}</td>
                    <td className="px-4 py-4 flex gap-3">
                      <button
                        onClick={() => openEditModal(show)}
                        className="text-blue-400 hover:text-blue-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(show.id, show.movie_id)}
                        className="text-red-400 hover:text-red-200"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E]/90 border border-[#4A9EDE]/40 px-8 py-6 rounded-xl shadow-xl max-w-lg w-full">
            <h2 className="text-lg font-bold text-white mb-4">Edit Show</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editModal.movie_title}
                disabled
                className="w-full p-2 rounded bg-black/30 border border-[#4A9EDE] text-white"
              />
              <input
                type="datetime-local"
                value={editModal.show_datetime}
                onChange={(e) =>
                  setEditModal({ ...editModal, show_datetime: e.target.value })
                }
                className="w-full p-2 rounded bg-black/30 border border-[#4A9EDE] text-white"
              />
              <input
                type="number"
                value={editModal.show_price}
                onChange={(e) =>
                  setEditModal({ ...editModal, show_price: e.target.value })
                }
                className="w-full p-2 rounded bg-black/30 border border-[#4A9EDE] text-white"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-full bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA] text-black font-semibold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListShows;