// ============================================
// 9. components/UserDashboard/RewardsCard.jsx
// ============================================
import { Gift } from 'lucide-react';

const RewardsCard = ({ points = 0, progress = 0 }) => {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">Rewards Points</h3>
          <p className="text-purple-100 text-sm">Keep shopping to earn more!</p>
        </div>
        <Gift className="w-8 h-8 text-white/80" />
      </div>
      
      <div className="mb-4">
        <div className="text-4xl font-bold mb-2">{points.toLocaleString()}</div>
        <div className="text-purple-100 text-sm">Points available</div>
      </div>

      <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Progress to next tier</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all backdrop-blur-sm">
        Redeem Points
      </button>
    </div>
  );
};

export default RewardsCard;