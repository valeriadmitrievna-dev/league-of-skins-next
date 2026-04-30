import { redirect } from "next/navigation";
const Home = () => redirect("/search/skins");

// const Home = () => {
//   throw new Error("test error");
//   return <div>Home</div>;
// };

export default Home;
