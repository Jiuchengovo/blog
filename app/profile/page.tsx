"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Reveal from "@/app/components/Reveal";

export default function ProfilePage() {
  const { user, token, loading, updateProfile, changePassword } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      await updateProfile({ username, bio, avatar });
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 6) {
      setPwdMsg({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    setChangingPwd(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwdMsg({ type: "success", text: "Password changed." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message });
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-6 pt-32 text-center" style={{ maxWidth: "36rem" }}>
        <p className="text-[#9CA3AF]">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto px-6 pt-28 pb-20 sm:pt-32 sm:pb-24" style={{ maxWidth: "36rem" }}>
      <Reveal delay={100}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2933] mb-3">
          Profile
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="text-[#6B7280] mb-10">
          Manage your profile and account settings.
        </p>
      </Reveal>

      {/* Profile section */}
      <Reveal delay={250}>
        <section className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[#1F2933] mb-6">Profile</h2>

          {profileMsg && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm mb-5 ${
                profileMsg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#1F2933]">Username</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#1F2933]">Bio</span>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short introduction about yourself…"
                className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow resize-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#1F2933]">Avatar URL</span>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
              />
            </label>

            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-xl bg-[#6B7D6D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5C6E5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </form>
        </section>
      </Reveal>

      {/* Password section */}
      <Reveal delay={350}>
        <section className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F2933] mb-6">Change password</h2>

          {pwdMsg && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm mb-5 ${
                pwdMsg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#1F2933]">Current password</span>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#1F2933]">New password</span>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
              />
            </label>

            <button
              type="submit"
              disabled={changingPwd}
              className="rounded-xl bg-[#6B7D6D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5C6E5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {changingPwd ? "Changing…" : "Change password"}
            </button>
          </form>
        </section>
      </Reveal>
    </div>
  );
}
