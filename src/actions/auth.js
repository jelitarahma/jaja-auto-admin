export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function receiveLogin() {
  return {
    type: LOGIN_SUCCESS
  };
}

function loginError(payload) {
  return {
    type: LOGIN_FAILURE,
    payload,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

// logs the user out
export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('authenticated');
    dispatch(receiveLogout());
  };
}

export function loginUser(creds) {
  return (dispatch) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": creds.email,
      "password": creds.password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://staging-api.jaja.id/admin/login-admin", requestOptions)
      .then(response => response.json())
      .then(result => {
        // Jika respons dari server adalah sukses, simpan token ke local storage
        if (result.status.code === 200) {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('authenticated', true);
          dispatch(receiveLogin());
          // Redirect pengguna ke halaman yang diinginkan setelah login berhasil
          // window.location.href = "/jaja-auto";
        } else {
          // Jika respons dari server adalah gagal, dispatch error message
          dispatch(loginError(result.status.message));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        dispatch(loginError('Something went wrong. Please try again.'));
      });
  }
}


