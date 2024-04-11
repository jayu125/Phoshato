import { SyncLoader } from "react-spinners";

export default function Loading(message) {
  return (
    <div>
      <h3>{message}</h3>
      <SyncLoader />
    </div>
  );
}
