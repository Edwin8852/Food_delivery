export const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const origin = req.get('origin') || 'no origin';
  
  // Log incoming request
  console.log(`\n[${timestamp}] 📨 INCOMING REQUEST`);
  console.log(`   Method: ${method}`);
  console.log(`   URL: ${url}`);
  console.log(`   Origin: ${origin}`);
  console.log(`   Headers: ${JSON.stringify(req.headers, null, 2).substring(0, 200)}...`);
  
  // Track response
  const originalSend = res.send;
  res.send = function(data) {
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '❌' : '✅';
    console.log(`   ${statusColor} Response Status: ${statusCode}`);
    console.log(`   Response Data Length: ${data?.length || 'N/A'} bytes\n`);
    return originalSend.call(this, data);
  };
  
  next();
};
