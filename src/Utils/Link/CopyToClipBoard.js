export const copyToClipboard = (text) => {
    // Create a temporary textarea to copy text to clipboard
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert("Copied To Clipboard!");
    // Optionally, you can provide user feedback or notifications about the successful copy
  };