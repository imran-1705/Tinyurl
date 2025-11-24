
export async function getServerSideProps({ params }) {
const base = process.env.NEXT_PUBLIC_BASE_URL || '';
const res = await fetch(`${base}/api/links/${params.code}`);
if (res.status === 404) return { notFound: true };
const data = await res.json();
return { props: { data } };
}


export default function CodeStats({ data }) {
return (
<div className="min-h-screen p-6 bg-gray-50">
<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
<h1 className="text-2xl mb-4">Stats for {data.Code}</h1>
<dl>
<dt className="font-semibold">Target</dt><dd className="mb-2">{data.Target}</dd>
<dt className="font-semibold">Short URL</dt><dd className="mb-2">{(process.env.NEXT_PUBLIC_BASE_URL || '') + '/' + data.Code}</dd>
<dt className="font-semibold">Total Clicks</dt><dd className="mb-2">{data.TotalClicks}</dd>
<dt className="font-semibold">Last Clicked</dt><dd className="mb-2">{data.LastClicked ? new Date(data.LastClicked).toLocaleString() : '-'}</dd>
<dt className="font-semibold">Created</dt><dd>{new Date(data.CreatedAt).toLocaleString()}</dd>
</dl>
</div>
</div>
);
}