import AlertBar    from '../components/AlertBar';
import Header      from '../components/Header';
import LeftPanel   from '../components/LeftPanel';
import LoginCard   from '../components/LoginCard';
import QuickLinks  from '../components/QuickLinks';
import Footer      from '../components/Footer';

export default function LoginPage() {
  return (
    <>
      <AlertBar />
      <Header />

      <main className="main-layout">
        <LeftPanel />

        <section className="right-panel" aria-label="Login section">
          <LoginCard />
          <QuickLinks />
        </section>
      </main>

      <Footer />
    </>
  );
}
