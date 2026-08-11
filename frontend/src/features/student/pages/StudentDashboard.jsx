import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import WelcomeCard from '../components/WelcomeCard';
import StudentStatsGrid from '../components/StudentStatsGrid';
import StudentOverviewCard from '../components/StudentOverviewCard';
import RecentActivitiesCard from '../components/RecentRequestsCard';
import { fetchStudentDashboardMetrics, fetchStudentRecentActivities, fetchStudentStudyInfo } from '../studentService';

const StudentDashboard = () => {
	const { user, accessToken, isAuthReady } = useAuth();
        const navigate = useNavigate();
	const [summaryStats, setSummaryStats] = useState({
		paymentsCount: undefined,
		complaintsCount: 0,
		requestsCount: 0,
	});
	const [recentActivities, setRecentActivities] = useState([]);
	const [isSummaryLoading, setIsSummaryLoading] = useState(true);
	const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
	const [summaryError, setSummaryError] = useState('');
	const [activitiesError, setActivitiesError] = useState('');
	const [studyInfo, setStudyInfo] = useState(null);

	const displayName =
		[user?.firstName, user?.secondName].filter(Boolean).join(' ') ||
		[user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
		'Student';

	useEffect(() => {
		if (!isAuthReady || !accessToken) {
			return;
		}

		let isMounted = true;

		const loadStudentSummary = async () => {
			if (!accessToken || !user) {
				setIsSummaryLoading(false);
				setIsActivitiesLoading(false);
				return;
			}

			setIsSummaryLoading(true);
			setIsActivitiesLoading(true);
			setSummaryError('');
			setActivitiesError('');

			try {
				const [dashboardMetricsResult, requestsResult, studyInfoResult] = await Promise.allSettled([
					fetchStudentDashboardMetrics(accessToken),
					fetchStudentRecentActivities(accessToken, 5),
					fetchStudentStudyInfo(accessToken),
				]);

				if (!isMounted) {
					return;
				}

				if (dashboardMetricsResult.status === 'fulfilled') {
					const dashboardMetrics = dashboardMetricsResult.value;

					setSummaryStats({
						paymentsCount: dashboardMetrics.paymentsCount,
						complaintsCount: dashboardMetrics.complaintsCount ?? 0,
						requestsCount: dashboardMetrics.requestsCount ?? 0,
					});
				} else {
					setSummaryError('Unable to load student metrics right now.');
					setSummaryStats({
						paymentsCount: undefined,
						complaintsCount: 0,
						requestsCount: 0,
					});
				}

				if (requestsResult.status === 'fulfilled') {
					const filteredActivities = requestsResult.value.filter(
						(activity) => String(activity.status || '').toLowerCase() !== 'resubmit'
					);
					setRecentActivities(filteredActivities);
				} else {
					setActivitiesError('Unable to load recent activities right now.');
					setRecentActivities([]);
				}

				if (studyInfoResult.status === 'fulfilled') {
					setStudyInfo(studyInfoResult.value);
				} else {
					setStudyInfo(null);
				}
			} catch {
				if (!isMounted) {
					return;
				}

				setSummaryError('Unable to load student metrics right now.');
				setActivitiesError('Unable to load recent activities right now.');
				setSummaryStats({
					paymentsCount: undefined,
					complaintsCount: 0,
					requestsCount: 0,
				});
				setRecentActivities([]);
				setStudyInfo(null);
			} finally {
				if (isMounted) {
					setIsSummaryLoading(false);
					setIsActivitiesLoading(false);
				}
			}
		};

		loadStudentSummary();

		return () => {
			isMounted = false;
		};
	}, [accessToken, isAuthReady, user]);

	const studentProfile = {
		name: displayName,
		college: user?.college || '',
		avatar: user?.photoURL || user?.photo_url || '',
		programNameEn: user?.program?.program_name_en || user?.student?.program?.program_name_en || '',
		programNameAr: user?.program?.program_name_ar || user?.student?.program?.program_name_ar || '',
		secondarySchool: user?.student?.secondary_school || user?.secondary_school || '',
		country: user?.student?.country || user?.country || '',
		secondaryQualification: user?.student?.secondary_qualification || user?.secondary_qualification || '',
		level: studyInfo?.level ?? user?.level ?? '',
		gpa: studyInfo?.cgpa ?? user?.cgpa ?? '',
		completedHours: studyInfo?.completedHours ?? user?.completedHours ?? user?.hours_taken ?? '',
		registeredHours: studyInfo?.totalRegisteredHours ?? user?.totalRegisteredHours ?? '',
		status: user?.status || '',
	};

	const metricCards = [
		Number.isFinite(summaryStats.paymentsCount)
			? {
				title: 'Payments',
				value: isSummaryLoading ? '...' : summaryStats.paymentsCount,
				accent: 'indigo',
				titleClassName: "font-['Manrope'] !text-[16px] md:!text-[17px] !text-indigo-900",
			}
			: null,
		{
			title: 'Complaints',
			value: isSummaryLoading ? '...' : summaryStats.complaintsCount,
			accent: 'amber',
			titleClassName: "font-['Manrope'] !text-[16px] md:!text-[17px] !text-indigo-900",
		},
		{
			title: 'Requests',
			value: isSummaryLoading ? '...' : summaryStats.requestsCount,
			accent: 'emerald',
			titleClassName: "font-['Manrope'] !text-[16px] md:!text-[17px] !text-indigo-900",
		},
	].filter(Boolean);

	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
				<div className="min-w-0 flex-1 space-y-6 w-full max-w-full">
					<WelcomeCard
						name={displayName}
					/>

					{summaryError ? (
						<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
							{summaryError}
						</div>
					) : null}

					<StudentStatsGrid items={metricCards} />
					
					{/* Recent Activity Section */}
					<RecentActivitiesCard
						activities={recentActivities}
						isLoading={isActivitiesLoading}
						error={activitiesError}
					/>
				</div>

				<div className="w-full shrink-0 xl:w-[280px] 2xl:w-[320px]">
					<StudentOverviewCard profile={studentProfile} onViewProfile={() => navigate('/profile')} />
				</div>
			</div>
		</section>
	);
};

export default StudentDashboard;