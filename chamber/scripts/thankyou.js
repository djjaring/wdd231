const params = new URLSearchParams(window.location.search);

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "(not provided)";
};

setText("outFirstName", params.get("firstName"));
setText("outLastName", params.get("lastName"));
setText("outEmail", params.get("email"));
setText("outMobile", params.get("mobile"));
setText("outBusiness", params.get("business"));

const ts = params.get("timestamp");
let tsDisplay = ts || "(not provided)";
if (ts) {
  const d = new Date(ts);
  if (!Number.isNaN(d.getTime())) {
    tsDisplay = d.toLocaleString();
  }
}
setText("outTimestamp", tsDisplay);
