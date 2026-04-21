document.addEventListener('DOMContentLoaded', () => {

    // --- STATIC DATA SIMULATING BACKEND ---
    const kpiData = [
        { title: 'Days to Close', value: '3', target: '<= 4', status: 'success' },
        { title: 'JE Volume', value: '142', target: 'Reduce 20%', status: 'success' },
        { title: 'Rework Rate', value: '1.5%', target: '< 2%', status: 'success' },
        { title: 'Approval SLA', value: '1.2h', target: '< 2h', status: 'success' },
        { title: 'Sub-ledger Recon', value: '5h', target: '< 4h', status: 'error' }
    ];

    let tasksData = [
        { id: 'P1', name: 'Review & Clear GR/IR Account', phase: 'Pre-Close', role: 'AP Team', status: 'Completed', tcode: 'MR11', timeline: 'Day -1', overdue: false },
        { id: 'F1', name: 'FX Revaluation - AR', phase: 'FI Sub-Ledger', role: 'Finance Controller', status: 'Completed', tcode: 'F.05', timeline: 'Day +1', overdue: false },
        { id: 'F4', name: 'Auto Payment Run', phase: 'FI Sub-Ledger', role: 'AP & Treasury', status: 'In Progress', tcode: 'F110', timeline: 'Day +1', overdue: true },
        { id: 'C2', name: 'Settle Internal Orders', phase: 'CO Close', role: 'Finance Controller', status: 'Pending', tcode: 'KO88', timeline: 'Day +2', overdue: false },
        { id: 'C3', name: 'Run Overhead Assessment', phase: 'CO Close', role: 'Mgmt. Accounting', status: 'Pending', tcode: 'KSU5', timeline: 'Day +2', overdue: false },
        { id: 'G2', name: 'Generate B/S & P&L', phase: 'GL Close', role: 'CFO', status: 'Pending', tcode: 'OB52', timeline: 'Day +3', overdue: false }
    ];

    // --- NAVIGATION LOGIC ---
    const navItems = document.querySelectorAll('.app-sidebar li');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetView = item.getAttribute('data-view');
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === 'view-' + targetView) {
                    view.classList.add('active');
                }
            });
            
            // Render charts dynamically when view is opened
            if (targetView === 'analytics') {
                renderCharts();
            }
        });
    });

    // --- DASHBOARD RENDERING ---
    const kpiContainer = document.getElementById('kpi-container');
    const mobileCardsContainer = document.getElementById('mobile-cards-container');

    function renderKPIs() {
        kpiContainer.innerHTML = '';
        mobileCardsContainer.innerHTML = '';

        kpiData.forEach(kpi => {
            // Main Desktop KPI card
            const card = document.createElement('div');
            card.className = 'fiori-card kpi-card';
            card.innerHTML = `
                <div class="kpi-title">${kpi.title}</div>
                <div class="kpi-value">${kpi.value}</div>
                <div><span class="badge ${kpi.status}">${kpi.status === 'success' ? 'On Track' : 'Needs Attention'}</span></div>
            `;
            kpiContainer.appendChild(card);

            // Responsive Mobile card
            const mobileCard = document.createElement('div');
            mobileCard.className = 'mobile-card';
            mobileCard.innerHTML = `
                <h4>${kpi.title}</h4>
                <p>Value: <strong>${kpi.value}</strong></p>
                <div style="margin-top: 10px;"><span class="badge ${kpi.status}">${kpi.status === 'success' ? 'Green' : 'Red'}</span></div>
            `;
            mobileCardsContainer.appendChild(mobileCard);
        });
    }
    renderKPIs();

    // --- TABLE RENDERING & FILTERING ---
    const taskTbody = document.getElementById('task-table-body');
    const phaseFilter = document.getElementById('phase-filter');
    
    function renderTasks(filter = 'All') {
        taskTbody.innerHTML = '';
        let hasOverdue = false;

        tasksData.forEach((task, index) => {
            if (filter !== 'All' && task.phase !== filter) return;

            if (task.overdue && task.status !== 'Completed') {
                hasOverdue = true;
            }

            const tr = document.createElement('tr');
            if (task.overdue && task.status !== 'Completed') tr.classList.add('overdue');
            
            let statusBadge = 'info';
            if (task.status === 'Completed') statusBadge = 'success';
            if (task.status === 'Pending') statusBadge = 'warning';

            tr.innerHTML = `
                <td>${task.id}</td>
                <td><a class="action-link task-link" data-index="${index}">${task.name}</a></td>
                <td>${task.phase}</td>
                <td>${task.role}</td>
                <td><span class="badge ${statusBadge}">${task.status}</span></td>
                <td>${task.timeline}</td>
                <td>
                    ${task.status !== 'Completed' ? `<a class="action-link mark-complete" data-index="${index}">Complete</a>` : ''}
                </td>
            `;
            taskTbody.appendChild(tr);
        });

        // Add event listeners for dynamic elements
        document.querySelectorAll('.task-link').forEach(link => {
            link.addEventListener('click', (e) => openTaskModal(e.target.getAttribute('data-index')));
        });
        document.querySelectorAll('.mark-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                tasksData[idx].status = 'Completed';
                tasksData[idx].overdue = false;
                renderTasks(phaseFilter.value);
            });
        });

        // Overdue Notification Logic
        if (hasOverdue) {
            document.getElementById('notification-popup').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('notification-popup').classList.add('hidden');
            }, 5000); // hide after 5 seconds
        } else {
             document.getElementById('notification-popup').classList.add('hidden');
        }
    }

    phaseFilter.addEventListener('change', (e) => {
        renderTasks(e.target.value);
    });
    
    renderTasks();

    // --- MODAL LOGIC ---
    const modal = document.getElementById('task-modal');
    const closeBtn = document.getElementById('modal-close');
    const btnCompleteTask = document.getElementById('btn-complete-task');
    let currentTaskIndex = null;

    function openTaskModal(index) {
        currentTaskIndex = index;
        const task = tasksData[index];
        
        document.getElementById('modal-title').innerText = `Task: ${task.id}`;
        document.getElementById('modal-desc').innerText = task.name;
        document.getElementById('modal-tcode').innerText = task.tcode;
        document.getElementById('modal-role').innerText = task.role;
        document.getElementById('modal-timeline').innerText = task.timeline;

        if (task.status === 'Completed') {
            btnCompleteTask.style.display = 'none';
        } else {
            btnCompleteTask.style.display = 'inline-block';
        }

        modal.classList.add('active');
    }

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    btnCompleteTask.addEventListener('click', () => {
        if (currentTaskIndex !== null) {
            tasksData[currentTaskIndex].status = 'Completed';
            tasksData[currentTaskIndex].overdue = false;
            renderTasks(phaseFilter.value);
            modal.classList.remove('active');
        }
    });

    // --- JE SIMULATION ---
    const jeForm = document.getElementById('je-form');
    const jeMessage = document.getElementById('je-message');
    const approvalQueue = document.getElementById('approval-queue');
    const pendingDesc = document.getElementById('pending-desc');
    const pendingAmount = document.getElementById('pending-amount');
    const btnApprove = document.getElementById('btn-approve');
    const btnReject = document.getElementById('btn-reject');

    jeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const desc = document.getElementById('je-desc').value;
        const amount = parseFloat(document.getElementById('je-amount').value);

        if (amount > 100000) {
            jeMessage.className = 'message error';
            jeMessage.innerText = 'Amount > 1,00,000 INR. Workflow triggered. Requires dual-control approval.';
            jeMessage.style.display = 'block';
            
            pendingDesc.innerText = desc;
            pendingAmount.innerText = amount.toLocaleString();
            approvalQueue.style.display = 'block';
        } else {
            jeMessage.className = 'message success';
            jeMessage.innerText = 'JE Posted Successfully (Auto-Approved).';
            jeMessage.style.display = 'block';
            approvalQueue.style.display = 'none';
        }
    });

    btnApprove.addEventListener('click', () => {
        jeMessage.className = 'message success';
        jeMessage.innerText = 'JE Approved and Posted via OData API.';
        approvalQueue.style.display = 'none';
        jeForm.reset();
    });

    btnReject.addEventListener('click', () => {
        jeMessage.className = 'message error';
        jeMessage.innerText = 'JE Rejected.';
        approvalQueue.style.display = 'none';
    });

    // --- BANK SIMLULATION ---
    const btnFetchBank = document.getElementById('btn-fetch-bank');
    const bankStatusBadge = document.getElementById('bank-status-badge');
    const bankSyncTime = document.getElementById('bank-sync-time');

    btnFetchBank.addEventListener('click', () => {
        bankStatusBadge.className = 'badge warning';
        bankStatusBadge.innerText = 'Syncing...';
        
        setTimeout(() => {
            const now = new Date();
            bankSyncTime.innerText = now.toLocaleString() + ' IST';
            bankStatusBadge.className = 'badge success';
            bankStatusBadge.innerText = 'Success (MT940 via CPI)';
        }, 1500);
    });

    // --- ANALYTICS (Chart.js) ---
    let chartsRendered = false;

    function renderCharts() {
        if (chartsRendered || typeof Chart === 'undefined') return;
        
        const ctxTasks = document.getElementById('tasksChart').getContext('2d');
        new Chart(ctxTasks, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'In Progress'],
                datasets: [{
                    data: [2, 3, 1], // Hardcoded breakdown
                    backgroundColor: ['#2b7c2b', '#bb0000', '#e9730c']
                }]
            },
            options: { responsive: true }
        });

        const ctxTrend = document.getElementById('trendChart').getContext('2d');
        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Period 8', 'Period 9', 'Period 10', 'Period 11', 'Period 12'],
                datasets: [{
                    label: 'Days to Close',
                    data: [6, 5, 5, 4, 3],
                    borderColor: '#0a6ed1',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: { 
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 8 }
                }
            }
        });
        
        chartsRendered = true;
    }
});
