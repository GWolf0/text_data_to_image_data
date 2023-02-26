import TextDataToDataImage from "./components/TextDataToDataImage"

function App(){

  return (
    <div className="App w-screen min-h-screen bg-lighter">
      <header className="flex items-center justify-center" style={{height:'100px'}}>
        <p className="text-darker font-semibold text-xl">Text Data To Data Image</p>
      </header>
      <main className="px-2 md:px-4 pt-6 pb-12 mx-auto" style={{width:'min(1280px,100%)',minHeight:'80vh'}}>
        <TextDataToDataImage />
        <section id="aboutSection" className="mt-6 border-t border-b border-semitrans py-2.5">
          <p className="text-dark font-semibold mb-2.5 underline">About</p>
          <p className="text-dark text-sm">
            This app converts a 'text data' into an 'image data', and vice versa, by writing text characters in image rgb values.<br/>
            Thus only ASCII characters are supported.<br/>
            And it uses a <b className="underline">simple</b> encryption method (XOR), with an optional key when converting from text to image and vice versa.
          </p>
        </section>
      </main>
      <footer className="flex items-center justify-center border-t border-semitrans" style={{height:'128px'}}>
        <p className="text-darkest text-xs font-semibold underline">Text Data To Data Image &copy;2023</p>
      </footer>
    </div>
  )
}

export default App
