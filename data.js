window.POSTA_DATA = {
  profile: {
    name: 'Omar Hassan', email: 'omar.hassan@worldposta.local', title: 'IT Operations Manager', department: 'Infrastructure & Messaging', manager: 'Nadia Fouad', avatar: 'OH', status: 'Available'
  },
  contacts: [
    { id: 'sara', name: 'Sara Nabil', email: 'sara.nabil@worldposta.local', title: 'Sales Lead', avatar: 'SN', presence: 'available' },
    { id: 'mariam', name: 'Mariam Adel', email: 'mariam.adel@worldposta.local', title: 'People Partner', avatar: 'MA', presence: 'away' },
    { id: 'youssef', name: 'Youssef Samir', email: 'youssef.samir@worldposta.local', title: 'Finance Controller', avatar: 'YS', presence: 'busy' },
    { id: 'support', name: 'Support Desk', email: 'support@worldposta.local', title: 'Shared Mailbox', avatar: 'SD', presence: 'offline' },
    { id: 'client', name: 'Lina Morgan', email: 'lina@northstar.example', title: 'External Client', avatar: 'LM', presence: 'external' }
  ],
  folders: [
    { id: 'inbox', label: 'Inbox', count: 18, unread: 7 },
    { id: 'priority', label: 'Priority', count: 6, unread: 3 },
    { id: 'sent', label: 'Sent', count: 142, unread: 0 },
    { id: 'drafts', label: 'Drafts', count: 4, unread: 0 },
    { id: 'archive', label: 'Archive', count: 1280, unread: 0 },
    { id: 'shared', label: 'Support Shared', count: 31, unread: 5 }
  ],
  threads: [
    {
      id: 't1', contact: 'sara', folder: 'inbox', unread: true, flagged: true, priority: 'High', subject: 'Proposal review before Thursday demo', last: '09:42', snippet: 'Can we make the classic screen feel premium enough for executives?', tags: ['Pitch', 'Design'],
      attachments: [{ name: 'posta-demo-outline.pdf', size: '1.8 MB', type: 'pdf' }],
      messages: [
        { from: 'sara', time: 'Yesterday 16:18', body: 'I pulled the stakeholder questions into one doc. The biggest ask is confidence: they want the classic mode to feel familiar but not like a cheap OWA clone.', meta: 'To: Omar · CC: Product' },
        { from: 'me', time: 'Yesterday 17:02', body: 'Agreed. We should treat Classic as the trust anchor and Chat as the innovation layer. Same mailbox, different pace.', meta: 'To: Sara' },
        { from: 'sara', time: 'Today 09:42', body: 'Exactly. Can we make the classic screen feel premium enough for executives? I want the reading pane to look like a cockpit, not a webmail table.', meta: 'To: Omar', attachments: [{ name: 'posta-demo-outline.pdf', size: '1.8 MB', type: 'pdf' }] }
      ]
    },
    {
      id: 't2', contact: 'youssef', folder: 'priority', unread: true, flagged: false, priority: 'Medium', subject: 'Invoice batch needs approval', last: '08:15', snippet: 'The Q2 vendor batch is ready, but two invoices need a second look.', tags: ['Finance'],
      attachments: [{ name: 'vendor-batch-q2.xlsx', size: '486 KB', type: 'xls' }],
      messages: [
        { from: 'youssef', time: 'Today 08:15', body: 'The Q2 vendor batch is ready, but two invoices need a second look before I release payment. Can you confirm the hosting line items?', meta: 'To: Omar · CC: Finance' }
      ]
    },
    {
      id: 't3', contact: 'mariam', folder: 'inbox', unread: false, flagged: false, priority: 'Low', subject: 'Updated remote work policy', last: 'Mon', snippet: 'Please review the updated policy before we publish it company-wide.', tags: ['HR'], attachments: [],
      messages: [
        { from: 'mariam', time: 'Mon 11:20', body: 'Please review the updated policy before we publish it company-wide. I highlighted the sections that affect IT support availability.', meta: 'To: Omar' },
        { from: 'me', time: 'Mon 12:04', body: 'Looks good. I only added a note about device compliance and VPN availability.', meta: 'To: Mariam' }
      ]
    },
    {
      id: 't4', contact: 'support', folder: 'shared', unread: true, flagged: true, priority: 'Urgent', subject: 'Escalation: shared mailbox delivery delay', last: '07:58', snippet: 'Several customers reported delayed responses from support@.', tags: ['Shared mailbox', 'Incident'], attachments: [],
      messages: [
        { from: 'support', time: 'Today 07:58', body: 'Several customers reported delayed responses from support@. Queue looks normal, but message trace shows slow delivery for external senders.', meta: 'Shared mailbox · To: IT Ops' }
      ]
    },
    {
      id: 't5', contact: 'client', folder: 'inbox', unread: false, flagged: true, priority: 'High', subject: 'Northstar onboarding: DNS + mailbox migration', last: 'Tue', snippet: 'We are ready for the migration window. Please confirm DNS cutover timing.', tags: ['External', 'Migration'],
      attachments: [{ name: 'migration-checklist.docx', size: '214 KB', type: 'doc' }, { name: 'dns-records.csv', size: '18 KB', type: 'csv' }],
      messages: [
        { from: 'client', time: 'Tue 10:10', body: 'We are ready for the migration window. Please confirm DNS cutover timing and the rollback plan for MX changes.', meta: 'External sender · To: Omar', attachments: [{ name: 'migration-checklist.docx', size: '214 KB', type: 'doc' }] },
        { from: 'me', time: 'Tue 10:35', body: 'Confirmed. We will start with low-TTL verification, then MX cutover, then mailbox delivery tests. I will send the final runbook today.', meta: 'To: Lina' }
      ]
    }
  ],
  notifications: [
    'Sara mentioned you in Proposal review',
    'Support Shared has 5 unread messages',
    'Draft auto-saved 2 minutes ago'
  ]
};
