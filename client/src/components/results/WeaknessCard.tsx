interface Props {
  weaknesses: string[];
}

function WeaknessCard({
  weaknesses,
}: Props) {
  return (
    <div>

      <h2 className="mb-5 text-3xl font-bold text-red-700">
        ⚠ Areas to Improve
      </h2>

      <div className="space-y-3">

        {weaknesses.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-red-50 p-4"
          >
            ❌ {item}
          </div>
        ))}

      </div>

    </div>
  );
}

export default WeaknessCard;