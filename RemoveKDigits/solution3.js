// Solution #3 - better
// left and right pointers + stack and Set

function removeKdigits(num, k)
{
   if (num.length <= k) return '0';

   const deletions = new Set();
   const stack = [];
   let left = 0;
   let right = 1;

   while (k > 0)
   {
      while (num[left] <= num[right])
      {
         left = right;
         right++;
      }

      deletions.add(left);
      if (stack[stack.length - 1] === left)
      {
         stack.pop();
      }

      left--;
      if (left >= 0 && !deletions.has(left))
      {
         stack.push(left);
      }
      else if (deletions.has(left) && stack.length > 0)
      {
         left= stack[stack.length - 1];
      }
      else
      {
         left = right;
         right++;
      }

      k--;
   }

   const strBuffer = [];
   for (let i = 0; i < num.length; i++)
   {
      if (!deletions.has(i))
      {
         if (num[i] === '0' && strBuffer.length === 0) continue;
         strBuffer.push(num[i]);
      }
   }

   return strBuffer.length > 0 ? strBuffer.join('') : '0';
}