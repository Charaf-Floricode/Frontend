import { downloadCoderingen } from "../../services/api";

export default function BedrijfLocatie() {
  const handleClick = async () => {
    try {
      const blob = await downloadCoderingen();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "coderingen.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download mislukt: " + e.message);
    }
  };

  return <button onClick={handleClick}>Download coderingen</button>;
}