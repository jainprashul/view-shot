import { RouterProvider } from "react-router";
import "./App.css";
import router from "./route";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
