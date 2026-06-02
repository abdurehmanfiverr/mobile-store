// Shows a 5-star rating (filled amber stars) plus the review count.
export default function Stars({ rating = 0, reviews }) {
  const full = Math.round(rating);

  return (
    <div className="mt-1 flex items-center gap-1 text-xs">
      <span aria-label={`${rating} out of 5 stars`}>
        <span className="text-amber-400">{"★".repeat(full)}</span>
        <span className="text-zinc-300">{"★".repeat(5 - full)}</span>
      </span>
      {reviews != null && <span className="text-zinc-400">({reviews})</span>}
    </div>
  );
}
