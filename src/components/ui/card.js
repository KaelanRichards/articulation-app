export function Card({ children }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">{children}</div>
  );
}

export function CardHeader({ children }) {
  return <div className="font-bold text-xl mb-2">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
