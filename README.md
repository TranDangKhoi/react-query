## React Query là gì?

TanStack Query (tên mới) hay React Query là thư viện giúp quản lý các state bất đồng bộ như data từ APIs.

Sức mạnh của Tanstack Query

- Quản lý cache data và cập nhật cực kỳ đơn giản với zero config
- Không dùng global state, reducer để quản lý, không học thuật khó hiểu. Quên Redux được rồi đó!
- Có khả năng tương thích và mở rộng với mọi use-case

## **FAQs:**

Câu hỏi: Tanstack Query dùng gì để gọi API?

> Tanstack Query không đảm nhận việc gọi API, việc gọi API sẽ thực hiện thông qua các thư viện bạn dùng như axios, fetch API. Còn Tanstack Query chỉ đảm nhận việc quản lý data và trigger khi cần thiết.

## Lưu ý

React Query có cơ chế caching hơi khác một chút so với RTK Query, nên đừng lấy logic của RTK Query rồi suy ngược lại y hệt cho React Query.

## Một số khái niệm cơ bản

### GET

- `useQuery({})`: Một hook được tích hợp sẵn trong thư viện Tanstack Query, dùng vào việc đọc dữ liệu (READ) và được truyền vào một số thuộc tính tiêu biểu mà mình nêu ở dưới

- `queryKey: [name, deps]`: Là một array chứa các giá trị cần có của nó

  - `name`: Định danh của việc bạn chuẩn bị làm, ví dụ bạn đang chuẩn bị lấy dữ liệu danh sách các học sinh thì `name` chuẩn nhất sẽ là **`students`**
  - `deps`: Giống như trong useEffect, khi giá trị bên trong này thay đổi thì **`queryFn`** sẽ được gọi lại một lần nữa, bạn có thể nest cái deps này bao nhiêu level cũng được, bởi vì Tanstack Query sử dụng thuật toán Deep Comparison để so sánh deps trước so với deps hiện tại

- `queryFn`: Là một function trả về Promise và **BẮT BUỘC** phải trả về một Promise, ví dụ:

```tsx
// Là một Promise trả về toàn bộ dữ liệu trong To Do List
useQuery({ queryKey: ["todos"], queryFn: fetchAllTodos });

// Hoặc có thể là một Promise trả về dữ liệu của một To Do bất kì
useQuery({ queryKey: ["todos", todoId], queryFn: () => fetchTodoById(todoId) });

// Viết thẳng vào như này luôn cũng được
useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId);
    return data;
  },
});

// Hoặc là sử dụng để trả về giá trị của một queryKey nào đó
useQuery({
  queryKey: ["todos", todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
});
```

Quan trọng thêm nữa, useQuery chứa một số thuộc tính như:

- `data`: Chứa dữ liệu trả về từ APIs

- `isLoading`: Trả về một giá trị **`boolean`**, detect được khi nào data được trả về từ API đang được fetch là data mới hoàn toàn - chưa được fetch về trước đây (vì khi data được fetch về nó sẽ được lưu trong bộ nhớ cache của react-query) và nếu quay lại xem data cũ thì data đó vẫn sẽ hiển thị ra ngay lập tức và giá trị boolean của isLoading trả về vẫn sẽ là false

- `isFetching`: Trả về một giá trị **`boolean`**, nhưng mỗi khi chuyển sang dữ liệu data mới và quay lại data cũ thì data cũ sẽ được fetch lại từ đầu và giá trị boolean trả về của isFetching sẽ là true

- `keepPreviousData`: Như tên gọi, nó giữ lại tất cả các data đã được fetch trước đó dựa trên staleTime và cacheTime ta config. Sau này gọi lại thì không cần fetch từ đầu

### POST, PUT, PATCH, ...

`useMutation`: Một hook được tích hợp sẵn trong thư viện Tanstack Query, dùng vào việc mutate (Create/Update/Delete) và chứa một số thuộc tính tiêu biểu mà mình nêu ở dưới

- `mutate`: Dùng để mutate data trong server

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  mutate(formState, {
    onSuccess: (data, variables, context) => {
      // data là response trả về
      // console.log("data", data);
      // variables là thông tin payload bạn vừa gửi lên server
      // console.log("variables", variables);
      // undefined: mình chưa rõ nó là cái gì
      // console.log("context", context);
      setFormState(initialState);
    },
  });
};

return (
  <form onSubmit={handleSubmit}>
  Your TSX Elements
  </form>;
)
```

- `mutateAsync`: Cũng như trên nhưng nó trả về một promise thôi, dùng cái nào cũng được cả

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const data = await mutateAsync(formState);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

return (
  <form onSubmit={handleSubmit}>
  Your TSX Elements
  </form>;
)
```

- `reset`: Reset toàn bộ giá trị `(error, data, ...)` nằm trong hook useMutation về giá trị nguyên thủy **(không phải reset value của các fields trong form đâu nha)**

## Một số khái niệm quan trọng

- `staleTime` (default `0` ms): Thời gian data **`được cho là đã cũ - stale`**. Khi GET data xong thì React Query sẽ đưa đống data bạn vừa GET vào một vùng gọi là **`vùng chứa những data cũ - vùng state`** nếu như bạn không config `staleTime` cho nó. vô hình chung, mỗi lần bạn thực hiện lại các thao tác cũ thì nó sẽ thực hiện call API cũ lại nhiều lần VÀ chúng ta không nên để điều đó xảy ra. Vì vậy ta phải set `staleTime` cho query hiện tại

  > **Lưu ý cái `stale` trên dev tool nó hiển thị là data của bạn `stale` và `active`**

- `cacheTime` (default `5*60*1000` ms tức 5 phút): Thời gian data sẽ bị xóa ra khỏi bộ nhớ đệm. Có thể data đã "cũ" nhưng nó chưa bị xóa ra khỏi bộ nhớ đệm vì bạn set `staleTime < cacheTime`. Thường thì người ta sẽ set `staleTime < cacheTime`

- `inactive`: là khi data đó không còn component nào subcribe cả

```tsx
const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodoList });
```

`result` là một object chứa một vài state rất quan trọng: `status`, `fetchStatus`,...

Những state về các khoảnh khắc của data

- `isLoading` or `status === 'loading'` - Query chưa có data
- `isError` or `status === 'error'` - Query xảy ra lỗi
- `isSuccess` or `status === 'success'` - Query thành công và data đã có sẵn

Những state về data

- `error` - Nếu `isError === true` thì `error` sẽ xuất hiện ở đây
- `data` - Nếu `isSuccess === true` thì `data` sẽ xuất hiện ở đây

Đặc biệt là `fetchStatus`

- `isFetching` or `fetchStatus === 'fetching'` - Đang fetching API.
- `isPaused` or `fetchStatus === 'paused'` - Query muốn fetch API nhưng bị tạm dừng vì một lý do nào đó.
- `fetchStatus === 'idle'` - Query không làm gì cả

### Nếu thấy quá rối vì quá nhiều trạng thái, sự khác nhau giữa `status` và `fetchStatus` là như thế nào?

Chỉ cần nhớ

- `status` cho thông tin `data` có hay không
- `fetchStatus` cho thông tin về `queryFn` có đang chạy hay không

## Cơ chế caching

Một data mà đã `stale` thì khi gọi lại query của data đó, nó sẽ fetch lại api. Nếu không `stale` thì không fetch lại api (đối với trường hợp `staleTime` giữa các lần giống nhau)

> Còn đối với trường hợp `staleTime` giữa 2 lần khác nhau thì nếu data của lần query thứ 1 xuất hiện lâu hơn thời gian `staleTime` của lần query thứ 2 thì nó sẽ bị gọi lại ở lần thứ 2, dù cho có stale hay chưa.
> Ví dụ: `useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 10*1000 })` xuất hiện 5s trước, bây giờ chúng ta gọi lại `useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 2*1000 })` thì rõ ràng cái data của lần 1 dù nó chưa được cho là stale nhưng nó xuất hiện 5s trước và lâu hơn thời gian staleTime là 2s nên nó sẽ bị gọi lại ở lần 2.

Một data mà bị xóa khỏi bộ nhớ (tức là quá thời gian `cacheTime`) thì khi gọi lại query của data đó, nó sẽ fetch lại api. Nếu còn chưa bị xóa khỏi bộ nhớ nhưng đã `stale` thì nó sẽ trả về data cached và fetch api ngầm, sau khi fetch xong nó sẽ update lại data cached và trả về data mới cho bạn.

Caching là một vòng đời của:

- Query Instance có hoặc không cache data
- Fetch ngầm (background fetching)
- Các inactive query
- Xóa cache khỏi bộ nhớ (Garbage Collection)

Một ví dụ như thế này cho anh em dễ hiều:

Giả sử chúng ta dùng `cacheTime` mặc định là **5 phút** và `staleTime` là `0`.

```jsx
function A() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
function B() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
function C() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
```

- `A` component được mount
  - Vì không có query nào với `['todos']` trước đó, nó sẽ fetch data
  - Khi fetch xong, data sẽ được cache dưới key là `['todos']`
  - hook đánh dấu data là `stale` (cũ) vì sau `0`s
- Bây giờ thì `B` component được mount ở một nơi nào đó
  - Vì cache data `['todos']` đã có trước đó, data từ cache sẽ trả về ngay lập tức cho component `B`
  - Vì cache data `['todos']` được cho là đã `stale` nên nó sẽ fetch api tại component `B`
    - Không quan trọng function `fetchTodos` ở `A` và `B` có giống nhau hay không, việc fetch api tại `B` sẽ cập nhật tất cả các state query liên quan của `B` và `A` vì 2 component cùng key => cùng subcribe đến một data
  - Khi fetch thành công, cache data `['todos']` sẽ được cập nhật, cả 2 comonent `A` và `B` cũng được cập nhật data mới
- Bây giờ thì `A` và `B` unmount, không còn sử dụng nữa, không còn subcribe đến cache data `['todos']` nữa nên data `['todos']` bị cho là `inactive`
  - Vì `inactive` nên `cacheTime` sẽ bắt đầu đếm ngược 5 phút
- Trước khi `cacheTime` hết thì ông `C` comopnent được mount. cache data `['todos']` được trả về ngay lập tức cho `C` và `fetchTodos` sẽ chạy ngầm. Khi nó hoàn thành thì sẽ cập nhật lại cache với data mới.
- Cuối cùng thì `C` unmount
- Không còn ai subcribe đến cache data `['todos']` trong 5 phút tiếp theo nữa và cache data `['todos']` bị xóa hoàn toàn
