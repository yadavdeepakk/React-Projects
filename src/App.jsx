import { useState, useCallback, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);

  const passwordRef = useRef(null);

  // Generate Password Function
  const generatePassword = useCallback(() => {
    let characters = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) characters += "0123456789";
    if (includeSymbols) characters += "!@#$%^&*()_+[]{}|;:,.<>?";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters[randomIndex];
    }

    setPassword(newPassword);

    // Update Password Strength
    let strength = 0;
    if (length >= 12) strength++;
    if (includeNumbers) strength++;
    if (includeSymbols) strength++;
    if (includeUppercase) strength++;
    setPasswordStrength(strength);
  }, [length, includeNumbers, includeSymbols, includeUppercase]);

  // Copy to Clipboard
  const copyToClipboard = () => {
    passwordRef.current.select();
    document.execCommand("copy");
    alert("Password copied to clipboard!");
  };

  // Generate Password on Load
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-center text-2xl font-bold mb-4">Password Generator</h1>

        {/* Password Display */}
        <div className="mb-4">
          <input
            ref={passwordRef}
            type="text"
            value={password}
            readOnly
            className="w-full bg-gray-700 text-orange-400 rounded p-2 text-center text-lg"
          />
          <button
            onClick={copyToClipboard}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Copy to Clipboard
          </button>
        </div>

        {/* Password Length Slider */}
        <div className="mb-4">
          <p className="mb-2">Password Length: {length}</p>
          <input
            type="range"
            min="8"
            max="20"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Checkboxes for Options */}
        <div className="flex items-center justify-between mb-4">
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
            <span className="ml-2">Include Numbers</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />
            <span className="ml-2">Include Symbols</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase(!includeUppercase)}
            />
            <span className="ml-2">Include Uppercase</span>
          </label>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Regenerate Password
        </button>

        {/* Password Strength Indicator */}
        <div className="mt-4">
          <p>Password Strength:</p>
          <div className="relative h-2 w-full rounded bg-gray-600 overflow-hidden">
            <div
              className={`absolute h-2 rounded transition-all duration-300 ${
                passwordStrength === 1
                  ? "bg-red-500"
                  : passwordStrength === 2
                  ? "bg-yellow-500"
                  : passwordStrength === 3
                  ? "bg-blue-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            {showQRCode ? "Hide QR Code" : "Show QR Code"}
          </button>
          {showQRCode && (
            <div className="mt-4">
              <QRCodeCanvas
                value={password}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                className="mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;

