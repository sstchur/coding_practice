// Solution #2 - good
// Mark deleted indices, try not to backtrack

function removeKdigits(num, k)
{
   num = [...num];
   let start = 0;
   for (let i = 0; i < k; i++)
   {
      const j = findIndexToDelete(num, start);
      start = j - 1;
      while (num[start] === -1)
      {
         start--;
         if (start < 0)
         {
            start = 0;
            break;
         }
      }
      num[j] = -1;
   }

   const strBuffer = [];
   for (let i = 0; i < num.length; i++)
   {
      if (num[i] !== -1)
      {
         if (num[i] === '0' && strBuffer.length === 0) continue;
         strBuffer.push(num[i]);
      }
   }

   return strBuffer.length > 0 ? strBuffer.join('') : '0';
}

function findIndexToDelete(arr, start)
{
   let lastIndex = -1;
   for (let i = start; i < arr.length; i++)
   {
      const current = arr[i];
      const last = arr[lastIndex] || -Infinity;

      if (current === -1) continue;

      if (last > current)
      {
         return lastIndex;
      }

      lastIndex = i;
   }

   return lastIndex;
}