#!/bin/bash

# Create standalone mockup file
cat > /Users/newproject/Documents/GitHub/vcsAcademy/MOCKUP_TOUR.html << 'EOFO'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VCSA Academy - Interactive Platform Tour</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #020204 0%, #1E3A8A 100%);
            color: #F8FAFC;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .logo-icon {
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            font-size: 1.5rem;
        }
        .logo-text h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #F8FAFC;
        }
        .logo-text p {
            font-size: 0.875rem;
            color: #94A3B8;
        }
        .skip-link {
            color: #94A3B8;
            text-decoration: none;
            font-size: 0.875rem;
        }
        .progress {
            margin-bottom: 2rem;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #D4AF37 0%, #B8860B 100%);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        .progress-text {
            display: flex;
            justify-content: space-between;
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #94A3B8;
        }
        .content {
            text-align: center;
            padding: 2rem 0;
        }
        .icon {
            font-size: 5rem;
            margin-bottom: 1rem;
        }
        .title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #F8FAFC;
            margin-bottom: 0.5rem;
        }
        .subtitle {
            font-size: 1.25rem;
            color: #D4AF37;
            margin-bottom: 2rem;
        }
        .description {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        .description p {
            font-size: 1.125rem;
            line-height: 1.75;
            color: #94A3B8;
        }
        .module-showcase {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        .module-showcase h3 {
            font-size: 1.5rem;
            color: #F8FAFC;
            margin-bottom: 1rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: #94A3B8;
        }
        .feature:before {
            content: "✓ ";
            color: #D4AF37;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .stat {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #D4AF37;
        }
        .stat-label {
            font-size: 0.75rem;
            color: #94A3B8;
            margin-top: 0.25rem;
        }
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        .btn {
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
        .btn-secondary {
            background: rgba(255,255,255,0.05);
            color: #94A3B8;
        }
        .btn-secondary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-primary {
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            color: #020204;
        }
        .btn-primary:hover {
            transform: scale(1.02);
        }
        .step {
            display: none;
        }
        .step.active {
            display: block;
        }
        .hidden {
            display: none;
        }
        .dashboard {
            display: none;
        }
        .dashboard.active {
            display: block;
        }
        .welcome {
            background: linear-gradient(90deg, rgba(212, 175, 55, 0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(139, 92, 246, 0.2) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            padding: 3rem;
            margin-bottom: 3rem;
            text-align: center;
        }
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        .module-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }
        .module-card:hover {
            border-color: rgba(212, 175, 55, 0.3);
            transform: translateY(-4px);
        }
        .module-emoji {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .module-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #F8FAFC;
            margin-bottom: 0.5rem;
        }
        .module-desc {
            font-size: 0.875rem;
            color: #94A3B8;
            margin-bottom: 1rem;
        }
        .cta-section {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
        }
        .cta-section h2 {
            font-size: 1.5rem;
            color: #F8FAFC;
            margin-bottom: 1rem;
        }
        .cta-section p {
            color: #94A3B8;
            margin-bottom: 1.5rem;
        }
        .login-box {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1.5rem;
        }
        .login-box p {
            font-size: 0.875rem;
            color: #94A3B8;
        }
        .login-box strong {
            color: #D4AF37;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">⭐</div>
                <div class="logo-text">
                    <h1>VCSA Academy</h1>
                    <p>Platform Tour</p>
                </div>
            </div>
            <a href="#dashboard" class="skip-link" onclick="showDashboard(); return false;">Skip to Dashboard</a>
        </div>

        <!-- PROGRESS -->
        <div class="progress" id="progress">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill" style="width: 11.11%"></div>
            </div>
            <div class="progress-text">
                <span id="stepLabel">Step 1 of 9</span>
                <span id="progressPercent">11%</span>
            </div>
        </div>

        <!-- TOUR STEPS -->
        <div class="content">
            <!-- Step 1: Welcome -->
            <div class="step active" id="step1">
                <div class="icon">⭐</div>
                <h2 class="title">Welcome to VCSA Academy!</h2>
                <p class="subtitle">Your Complete Sales Operating System</p>
                <div class="description">
                    <p>This platform will transform you into a top vacation club sales producer. Let me show you around.</p>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" disabled>← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 2: Daily Performance -->
            <div class="step" id="step2">
                <div class="icon">📊</div>
                <h2 class="title">Track Daily Performance</h2>
                <p class="subtitle">Daily Performance Module</p>
                <div class="description">
                    <p>Log your tours, presentations, and closes every day. Track 7 key attributes and build winning streaks.</p>
                </div>
                <div class="module-showcase">
                    <h3>Daily Performance</h3>
                    <div class="features">
                        <div class="feature">25-Day Grid View</div>
                        <div class="feature">7 Core Attributes</div>
                        <div class="feature">Real-time Tracking</div>
                        <div class="feature">Streak Bonuses</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Tours Today</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">2</div>
                            <div class="stat-label">Presentations</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">1</div>
                            <div class="stat-label">Closes</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">$12,500</div>
                            <div class="stat-label">Revenue</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 3: Goal Sheet -->
            <div class="step" id="step3">
                <div class="icon">🎯</div>
                <h2 class="title">Set SMART Goals</h2>
                <p class="subtitle">Goal Sheet Module</p>
                <div class="description">
                    <p>Define clear, measurable goals for income, activity, skills, and performance. Track progress and celebrate achievements.</p>
                </div>
                <div class="module-showcase">
                    <h3>Goal Sheet</h3>
                    <div class="features">
                        <div class="feature">SMART Goals</div>
                        <div class="feature">Progress Tracking</div>
                        <div class="feature">Milestones</div>
                        <div class="feature">Achievement Badges</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">11</div>
                            <div class="stat-label">Total Goals</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">4</div>
                            <div class="stat-label">Completed</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">7</div>
                            <div class="stat-label">In Progress</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">72%</div>
                            <div class="stat-label">Progress</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 4: Financial Planner -->
            <div class="step" id="step4">
                <div class="icon">💰</div>
                <h2 class="title">Plan Your Financial Future</h2>
                <p class="subtitle">Financial Planner Module</p>
                <div class="description">
                    <p>Project your income, track savings goals, and create a budget. See where you'll be in 3 years.</p>
                </div>
                <div class="module-showcase">
                    <h3>Financial Planner</h3>
                    <div class="features">
                        <div class="feature">3-Year Projections</div>
                        <div class="feature">Savings Goals</div>
                        <div class="feature">Budget Planner</div>
                        <div class="feature">Income Calculator</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">$12,200</div>
                            <div class="stat-label">Monthly Income</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">28%</div>
                            <div class="stat-label">Savings Rate</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">$18,500</div>
                            <div class="stat-label">Projected</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">$45,000</div>
                            <div class="stat-label">Total Savings</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 5: Training -->
            <div class="step" id="step5">
                <div class="icon">🏆</div>
                <h2 class="title">Master the Training</h2>
                <p class="subtitle">Top Producer Path</p>
                <div class="description">
                    <p>Complete 36 training sessions across 6 tracks. Progress from New Rep to Top Producer.</p>
                </div>
                <div class="module-showcase">
                    <h3>Top Producer Path</h3>
                    <div class="features">
                        <div class="feature">4 Stages</div>
                        <div class="feature">6 Tracks</div>
                        <div class="feature">36 Sessions</div>
                        <div class="feature">Certificates</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">12</div>
                            <div class="stat-label">Completed</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">5</div>
                            <div class="stat-label">In Progress</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">67%</div>
                            <div class="stat-label">Readiness</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">19</div>
                            <div class="stat-label">Remaining</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 6: Coaching -->
            <div class="step" id="step6">
                <div class="icon">👥</div>
                <h2 class="title">Get Expert Coaching</h2>
                <p class="subtitle">Coaching Platform</p>
                <div class="description">
                    <p>Join live sessions, practice with role play, and get answers in Q&A forums.</p>
                </div>
                <div class="module-showcase">
                    <h3>Coaching Platform</h3>
                    <div class="features">
                        <div class="feature">Live Sessions</div>
                        <div class="feature">Role Play</div>
                        <div class="feature">Q&A Forums</div>
                        <div class="feature">Expert Access</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">10</div>
                            <div class="stat-label">Upcoming</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Registered</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">Weekly</div>
                            <div class="stat-label">Group</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">Bi-weekly</div>
                            <div class="stat-label">Q&A</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 7: Resources -->
            <div class="step" id="step7">
                <div class="icon">📄</div>
                <h2 class="title">Access Proven Resources</h2>
                <p class="subtitle">Knowledge Hub</p>
                <div class="description">
                    <p>Download battle-tested frameworks, scripts, and templates used by top producers.</p>
                </div>
                <div class="module-showcase">
                    <h3>Resources Library</h3>
                    <div class="features">
                        <div class="feature">Frameworks</div>
                        <div class="feature">Scripts</div>
                        <div class="feature">Templates</div>
                        <div class="feature">Tools</div>
                        <div class="feature">Case Studies</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">10</div>
                            <div class="stat-label">Resources</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">2</div>
                            <div class="stat-label">Frameworks</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">2</div>
                            <div class="stat-label">Scripts</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">4</div>
                            <div class="stat-label">Downloads</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 8: Analytics -->
            <div class="step" id="step8">
                <div class="icon">📈</div>
                <h2 class="title">Analyze & Improve</h2>
                <p class="subtitle">Analytics Dashboard</p>
                <div class="description">
                    <p>Dive deep into your performance metrics. Get predictive insights and track trends over time.</p>
                </div>
                <div class="module-showcase">
                    <h3>Analytics Dashboard</h3>
                    <div class="features">
                        <div class="feature">Efficiency Dashboard</div>
                        <div class="feature">Predictive Insights</div>
                        <div class="feature">Monthly Reports</div>
                        <div class="feature">Trends</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">28%</div>
                            <div class="stat-label">Conversion</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">12%</div>
                            <div class="stat-label">Growth</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">#5</div>
                            <div class="stat-label">Ranking</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">3.2</div>
                            <div class="stat-label">Avg Deal</div>
                        </div>
                    </div>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">Next →</button>
                </div>
            </div>

            <!-- Step 9: Complete -->
            <div class="step" id="step9">
                <div class="icon">🚀</div>
                <h2 class="title">You're All Set!</h2>
                <p class="subtitle">Start Your Journey</p>
                <div class="description">
                    <p>All modules are ready to use. Start with Daily Performance or explore whatever interests you most.</p>
                </div>
                <div class="nav">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="showDashboard()">Finish Tour →</button>
                </div>
            </div>
        </div>

        <!-- DASHBOARD VIEW -->
        <div class="dashboard" id="dashboard">
            <div class="welcome">
                <h2>Welcome to Your Sales Operating System</h2>
                <p>12 powerful modules to transform your sales performance</p>
            </div>

            <div class="modules-grid">
                <div class="module-card">
                    <div class="module-emoji">📊</div>
                    <h3 class="module-title">Daily Performance</h3>
                    <p class="module-desc">Track daily sales metrics with 25-day grid</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">🎯</div>
                    <h3 class="module-title">Goal Sheet</h3>
                    <p class="module-desc">Set SMART goals across 4 categories</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">💰</div>
                    <h3 class="module-title">Financial Planner</h3>
                    <p class="module-desc">3-year income projections & savings</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">📈</div>
                    <h3 class="module-title">Analytics</h3>
                    <p class="module-desc">Efficiency, predictions & monthly reports</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">🏆</div>
                    <h3 class="module-title">Top Producer Path</h3>
                    <p class="module-desc">36 training sessions across 6 tracks</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">📚</div>
                    <h3 class="module-title">Training Library</h3>
                    <p class="module-desc">Video training with progress tracking</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">🎪</div>
                    <h3 class="module-title">Coaching Events</h3>
                    <p class="module-desc">Live sessions, role play & Q&A</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">👥</div>
                    <h3 class="module-title">Group Coaching</h3>
                    <p class="module-desc">Weekly peer learning sessions</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">🎭</div>
                    <h3 class="module-title">Role Play Sessions</h3>
                    <p class="module-desc">12 practice scenarios with feedback</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">❓</div>
                    <h3 class="module-title">Q&A Sessions</h3>
                    <p class="module-desc">Bi-weekly expert panel access</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">📄</div>
                    <h3 class="module-title">Resources Library</h3>
                    <p class="module-desc">10 downloadable resources</p>
                </div>
                <div class="module-card">
                    <div class="module-emoji">🌐</div>
                    <h3 class="module-title">Community</h3>
                    <p class="module-desc">Connect with other professionals</p>
                </div>
            </div>

            <div class="cta-section">
                <h2>Try the Full System</h2>
                <p>Login to experience all modules with complete demo data</p>
                <div class="login-box">
                    <p><strong>Admin:</strong> admin@vcsa.com / admin123</p>
                    <p><strong>Demo:</strong> sarah.johnson@vcsa.com / demo123</p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="http://localhost:1234" class="btn btn-primary">Open Dashboard →</a>
                    <button class="btn btn-secondary" onclick="showTour()">Watch Tour Again</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStep = 1;
        const totalSteps = 9;

        function updateProgress() {
            const percent = ((currentStep) / totalSteps) * 100;
            document.getElementById('progressFill').style.width = percent + '%';
            document.getElementById('stepLabel').textContent = 'Step ' + currentStep + ' of ' + totalSteps;
            document.getElementById('progressPercent').textContent = Math.round(percent) + '%';
        }

        function showStep(stepNum) {
            // Hide all steps
            for (let i = 1; i <= totalSteps; i++) {
                document.getElementById('step' + i).classList.remove('active');
            }
            // Show current step
            document.getElementById('step' + stepNum).classList.add('active');
            updateProgress();
        }

        function nextStep() {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        }

        function showDashboard() {
            document.querySelector('.content').style.display = 'none';
            document.getElementById('progress').style.display = 'none';
            document.getElementById('dashboard').classList.add('active');
        }

        function showTour() {
            document.querySelector('.content').style.display = 'block';
            document.getElementById('progress').style.display = 'block';
            document.getElementById('dashboard').classList.remove('active');
            currentStep = 1;
            showStep(1);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                nextStep();
            } else if (e.key === 'ArrowLeft') {
                prevStep();
            }
        });
    </script>
</body>
</html>
EOFO

echo ""
echo "✅ MOCKUP TOUR CREADO!"
echo ""
echo "📍 Location: /Users/newproject/Documents/GitHub/vcsAcademy/MOCKUP_TOUR.html"
echo ""
echo "🚀 Abriendo en tu navegador..."
echo ""

# Open automatically
if [[ "$OSTYPE" == "darwin"* ]]; then
    open /Users/newproject/Documents/GitHub/vcsAcademy/MOCKUP_TOUR.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open /Users/newproject/Documents/GitHub/vcsAcademy/MOCKUP_TOUR.html 2>/dev/null || \
    echo "Abre manualmente: file:///Users/newproject/Documents/GitHub/vcsAcademy/MOCKUP_TOUR.html"
fi
