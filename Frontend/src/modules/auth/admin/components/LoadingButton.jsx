import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingButton({ 
  children, 
  loading = false, 
  type = "submit", 
  onClick,
  color = "primary" 
}) {
  const isSecondary = color === "secondary";

  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`w-full py-3.5 ${
        isSecondary 
          ? 'bg-teal hover:bg-teal-dark text-white' 
          : 'bg-forest hover:bg-forest-dark text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm transition-all duration-200 tap-scale flex items-center justify-center min-h-[46px] cursor-pointer`}
    >
      {loading ? (
        <CircularProgress size={18} color="inherit" />
      ) : (
        children
      )}
    </button>
  );
}
