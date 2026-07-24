interface Props {
  strengths: string[];
}

function StrengthsCard({
  strengths,
}: Props) {
  return (
    <div>

      <h2 className="mb-5 text-3xl font-bold text-green-700">
        🏆 Strengths
      </h2>

      <div className="space-y-3">

        {strengths.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-green-50 p-4"
          >
            ✅ {item}
          </div>
        ))}

      </div>

    </div>
  );
}

export default StrengthsCard;