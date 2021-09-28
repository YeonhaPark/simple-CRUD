async function getUser() {
  try {
    const res = await axios.get('/users');
    const users = res.data;
    const list = document.getElementById('list');

    list.innerHTML = '';

    // create tags when GET /users returns object with key value
    Object.keys(users).map(function (key) {
      const userDiv = document.createElement('div');
      const input = document.createElement('input');
      input.setAttribute('value', users[key])
      input.setAttribute('disabled', true)
      input.setAttribute('id', `input-${users[key]}`)
      const edit = document.createElement('button');
      edit.textContent = 'modify';

      input.addEventListener('change', async (e) => {
        input.defaultValue = e.target.value;
      })

      edit.addEventListener('click', async () => {
        if (edit.textContent === 'update') {
          try {
            // send data to server
            const inputClicked = document.getElementById(`input-${users[key]}`)
            const inputValue = inputClicked.value;
            await axios.put('/user/' + key, { name: inputValue });
            getUser();
          } catch (err) {
            console.error(err);
          }
        } else {
          // enable modifying input box
          const inputClicked = document.getElementById(`input-${users[key]}`)
          inputClicked.removeAttribute('disabled');
          edit.textContent = 'update';
        }
      });
      const remove = document.createElement('button');
      remove.textContent = 'delete';
      remove.addEventListener('click', async () => {
        try {
          await axios.delete('/user/' + key);
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      userDiv.appendChild(input);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser; // call getUser when screen loads

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  if (!name) {
    return alert('Please type your name');
  }
  try {
    await axios.post('/user', { name });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.name.value = '';
});