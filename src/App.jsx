import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="w-screen h-screen">
      <AudioPlayer />
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
