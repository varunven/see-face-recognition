import React, { useEffect, useState } from 'react'

function ForgetFaces({ socket }) {
  const [showPopup, setShowPopup] = useState(false)
  const [passwordResult, setForgettingResult] = useState('')

  useEffect(() => {
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/viewer`
  }, []);

  const handleInitialButtonClick = () => {
    setShowPopup(true)
  }

  const handlePopupButtonClick = () => {
    console.log("Forgetting all faces")
    socket.emit('see-request', {
      service_name: "forget-faces",
      toForget: true
    })
    setForgettingResult('Faces forgotten successfully!')
  }

  return (
    <div>
      {/* <button onClick={handleInitialButtonClick}>Forget All Faces</button>
      {showPopup && (
        <div className="popup">
          <p>Forgetting faces cannot be undone! All faces will be deleted. Is this ok?</p>
          <button onClick={handlePopupButtonClick}>Confirm Forget All Faces</button>
        </div>
      )}
      {passwordResult && <p>{passwordResult}</p>} */}
    </div>
  )
}

export default ForgetFaces
