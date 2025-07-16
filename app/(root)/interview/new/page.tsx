import { getCurrentUser } from '@/lib/actions/auth.action';
import InterviewForm from '@/components/InterviewForm';

const NewInterviewPage = async () => {
  const user = await getCurrentUser();
  return <InterviewForm userId={user?.id || ''} />;
};

export default NewInterviewPage; 