import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h1>404 — страница не найдена</h1>
      <Link href="/">На главную</Link>
    </div>
  );
};

export default NotFound;
