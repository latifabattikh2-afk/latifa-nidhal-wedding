(() => {
  const target = new Date("2027-01-02T15:30:00");
  const output = document.getElementById("countdown");
  const update = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      output.textContent = "أهلاً بكم في يوم فرحتنا";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    output.textContent = `${days} يوم · ${hours} ساعة · ${minutes} دقيقة · ${seconds} ثانية`;
  };
  update();
  setInterval(update, 1000);
})();
