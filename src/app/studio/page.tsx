import DispatchForm from "@/components/DispatchForm";
import { logout } from "@/lib/authActions";

export default function StudioPage() {
  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-white border border-slate-200 rounded-xl dark:bg-navy-900 dark:border-navy-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Field Studio</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-navy-400 dark:hover:text-white"
          >
            Log out
          </button>
        </form>
      </div>
      <DispatchForm />
    </div>
  );
}
