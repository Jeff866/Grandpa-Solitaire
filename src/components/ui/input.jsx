
export function Input(props) {
  return <input {...props} className={`border rounded-lg px-3 py-2 text-sm w-full ${props.className||""}`} />;
}
