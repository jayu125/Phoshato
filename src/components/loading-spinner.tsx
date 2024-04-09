import { SyncLoader } from "react-spinners";

export default function Loading(message: string) {
  return (
    <div>
      <h3>{message}</h3>
      <SyncLoader />
    </div>
  );
}
