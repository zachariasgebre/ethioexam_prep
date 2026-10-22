import Link from "next/link";

export function Navbar() { return <header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><Link href="/" className="font-bold text-emerald-800">EthioExam Prep</Link><div className="flex gap-5 text-sm"><Link href="/exams">Exams</Link><Link href="/dashboard">Dashboard</Link></div></nav></header>; }
