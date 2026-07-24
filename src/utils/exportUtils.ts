import { SystemLog } from '../types';

/**
 * Exports system activity logs to a CSV file.
 */
export const exportLogsToCSV = (logs: SystemLog[], filenamePrefix: string = 'balesin_system_logs') => {
  if (!logs || logs.length === 0) {
    alert('Tidak ada data log untuk diunduh.');
    return;
  }

  const headers = ['ID', 'Waktu & Tanggal', 'Tingkat (Level)', 'Aktivitas Otomasi / Event', 'Platform / Node'];
  const rows = logs.map(log => [
    `"${log.id || ''}"`,
    `"${log.timestamp || ''}"`,
    `"${log.level || ''}"`,
    `"${(log.event || '').replace(/"/g, '""')}"`,
    `"${(log.node || '').replace(/"/g, '""')}"`
  ]);

  // UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const todayStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports system activity logs to a printable PDF document layout.
 */
export const exportLogsToPDF = (logs: SystemLog[], userName?: string) => {
  if (!logs || logs.length === 0) {
    alert('Tidak ada data log untuk diunduh.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup terblokir browser. Harap izinkan popup untuk mengunduh laporan PDF.');
    return;
  }

  const dateStr = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalCount = logs.length;
  const successCount = logs.filter(l => l.level === 'SUCCESS').length;
  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warningCount = logs.filter(l => l.level === 'WARNING' || l.level === 'ERROR').length;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Laporan Log Aktivitas Otomasi - balesin.ai</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 32px;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 13px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #F2542D;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            color: #F2542D;
            letter-spacing: -0.5px;
          }
          .sub {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
          }
          .meta-info {
            text-align: right;
            font-size: 11px;
            color: #475569;
          }
          .meta-info strong {
            color: #0f172a;
          }
          .summary-grid {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
          }
          .stat-card {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
          }
          .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
          }
          .stat-value {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 8px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            text-align: left;
            padding: 10px 12px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #cbd5e1;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .badge-SUCCESS { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
          .badge-INFO { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
          .badge-WARNING { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
          .badge-ERROR { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
          .time-code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 11px;
            color: #64748b;
          }
          .node-tag {
            color: #0ea5e9;
            font-weight: 600;
          }
          .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; margin: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">
              <span class="logo">balesin.ai</span>
            </div>
            <div class="sub">Dokumen Resmi Laporan Telemetri & Log Otomasi AI</div>
          </div>
          <div class="meta-info">
            <div><strong>Tanggal Cetak:</strong> ${dateStr}</div>
            <div><strong>Operator:</strong> ${userName || 'Pengguna Balesin'}</div>
            <div><strong>Total Data:</strong> ${totalCount} entri aktivitas</div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-label">Total Aktivitas Log</div>
            <div class="stat-value">${totalCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Eksekusi Sukses</div>
            <div class="stat-value" style="color: #15803d;">${successCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Sinyal Informasi</div>
            <div class="stat-value" style="color: #0369a1;">${infoCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Peringatan / Isu</div>
            <div class="stat-value" style="color: #b45309;">${warningCount}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 18%;">Waktu Exec</th>
              <th style="width: 12%;">Status</th>
              <th>Deskripsi Aktivitas Otomasi</th>
              <th style="width: 22%;">Node / Platform</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(log => `
              <tr>
                <td class="time-code">${log.timestamp || '-'}</td>
                <td><span class="badge badge-${log.level || 'INFO'}">${log.level || 'INFO'}</span></td>
                <td><strong>${log.event || '-'}</strong></td>
                <td class="node-tag">${log.node || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <span>balesin.ai — Platform Otomasi Media Sosial & Chatbot AI</span>
          <span>Dokumen Dihasilkan Secara Otomatis</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
