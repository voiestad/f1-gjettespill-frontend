import axios from 'axios';

function Backup() {

  async function downloadBackup(event) {
    event.preventDefault();
    axios.get('/api/admin/getbackup', {
      responseType: "blob",
    }).then(res => {
      const blob = new Blob([res.data]);
      const filename = res.headers["content-disposition"].split("filename=")[1];
      const urlObject = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObject;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObject);
    }).catch(err => {
      console.error(err);
      alert("Det skjedde en feil mens sikkerhetskopien ble lastet ned");
    });
  }

  return (
    <>
      <title>Sikkerhetskopi</title>
      <h2>Sikkerhetskopi</h2>
      <button onClick={downloadBackup}>Last ned sikkerhetskopi</button>
    </>
  )
}

export default Backup
