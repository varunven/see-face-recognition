import React, {useState} from 'react';

function ForgetFaces() {
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [passwordResult, setPasswordResult] = useState('');

  const handleInitialButtonClick = () => {
    setShowPopup(true);
  };

  const handlePopupButtonClick = () => {
    setPasswordEntered(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = 'secret';

    if (password === correctPassword) {
      setPasswordResult('Correct password entered!');
    } else {
      setPasswordResult('Incorrect password entered!');
    }

    setPassword('');
  };

  return (
    <div>
      <button onClick={handleInitialButtonClick}>Forget All Faces</button>
      {showPopup && (
        <div className="popup">
          <p>Forgetting faces cannot be undone! All faces will be deleted. Is this ok?</p>
          {passwordEntered ? (
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <button onClick={handlePopupButtonClick}>Confirm Forget All Faces</button>
          )}
        </div>
      )}
      {passwordResult && <p>{passwordResult}</p>}
    </div>
  );
}

export default ForgetFaces;
