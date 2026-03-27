interface TriumphScreenProps {
  onReset: () => void;
}

export function TriumphScreen({ onReset }: TriumphScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/90 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-4 text-center space-y-6 animate-[fadeIn_1.5s_ease-in]">
        <div className="space-y-2">
          <p className="font-serif text-amber-400 text-sm tracking-[0.3em] uppercase">
            Metamorphosis Complete
          </p>
          <h1 className="font-serif text-5xl text-amber-200 leading-tight">
            Arbor Eris
          </h1>
          <p className="font-serif text-amber-400 text-xl italic">
            The Laurel stands eternal
          </p>
        </div>

        <div className="border-t border-b border-amber-800 py-6 space-y-4">
          <p className="font-serif text-stone-300 text-base italic leading-relaxed">
            "tu ducibus Latiis aderis, cum laeta Triumphum
            <br />
            vox canet et visent longas Capitolia pompas."
          </p>
          <p className="text-stone-500 text-sm leading-relaxed">
            "You shall attend the Latin commanders when joyful voices sing
            <br />
            of Triumph and the Capitol beholds its long processions."
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-serif text-amber-300 text-base">
            Daphne is transformed. Apollo's pursuit ends.
          </p>
          <p className="text-stone-500 text-sm">
            The Laurel tree stands as eternal testament — worn by victors, beloved of gods.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex justify-center gap-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400"
                style={{
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </div>

          <button
            onClick={onReset}
            className="mt-4 font-serif border border-amber-700 text-amber-400 hover:bg-amber-900/30 px-8 py-2.5 rounded text-sm transition-colors duration-200"
          >
            Begin Again — A New Nymph Flees
          </button>
        </div>
      </div>
    </div>
  );
}
