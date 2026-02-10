import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

// 1. 各ページのコンポーネント（本来は別ファイルに分けますが、まずは同じファイルでOK）

const About = () => <h1 className="text-5xl font-bold text-red-500">
  これで見えたら成功！
</h1>;
const Contact = () => <h2>お問い合わせはこちら</h2>;

function App() {
  return (
    <BrowserRouter>
      {/* 2. 全ページ共通のナビゲーション */}
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link style={{ margin: '10px' }} to="/">ホーム</Link>
        <Link style={{ margin: '10px' }} to="/about">About</Link>
        <Link style={{ margin: '10px' }} to="/contact">Contact</Link>
      </nav>

      {/* 3. URLに応じて中身が切り替わるエリア */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;