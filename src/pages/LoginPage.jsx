import AlertBar    from '../components/AlertBar';
import Header      from '../components/Header';
import LeftPanel   from '../components/LeftPanel';
import LoginCard   from '../components/LoginCard';
import QuickLinks  from '../components/QuickLinks';
import Footer      from '../components/Footer';
import ToastContainer from '../components/ToastContainer';
import useToast    from '../hooks/useToast';

export default function LoginPage() {
  const { toasts, addToast, removeToast } = useToast();

  const handleLoginSuccess = ({ type, userId, mobile }) => {
    addToast({
      type: 'success',
      title: 'Login Successful!',
      message: type === 'password'
        ? `Welcome back, ${userId}. Redirecting to your dashboard…`
        : `OTP verified for +91 ${mobile}. Redirecting to dashboard…`,
      duration: 6000,
    });
  };

  return (
    <>
      <AlertBar />
      <Header />

      <main className="main-layout">
        <LeftPanel />

        <section className="right-panel" aria-label="Login section">
          <LoginCard onSuccess={handleLoginSuccess} />
          <QuickLinks />
        </section>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
