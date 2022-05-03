function handleClickDone (e) {
  const todoid = e.dataset.todoid;
  fetch("/done", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      todoID: todoid
    })
  }).then(() => {
    window.location.reload();
  })
}