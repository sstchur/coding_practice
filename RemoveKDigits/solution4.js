// Solution #4 - best
// Determine which elements to keep instead of which elements to delete

function removeKdigits(num, k)
{
   if (num.length <= k) return '0';

   const stack = [num[0]];
   let current = num[1];
   let prev = num[0];

   for (let i = 1; i < num.length; i++)
   {
      while (k > 0)
      {
         while (current >= prev)
         {
            if (current > 0 || stack.length > 1) stack.push(current);
            prev = current;
            current = num[++i];
         }
         stack.pop();
         prev = stack[stack.length - 1];
         if (prev === undefined) prev = -Infinity;
         k--;
      }

      if (stack.length === 0)
      {
         if (num[i] > 0) stack.push(num[i]);
      }
      else
      {
         if (num[i] >= 0) stack.push(num[i]);
      }
   }

   return stack.join('') || '0'
}