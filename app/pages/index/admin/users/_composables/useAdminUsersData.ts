import { getAdminUsers } from "~/domain/admin/api/admin-users.api";
import type { AdminUser } from "~/domain/admin/models/admin.types";
import { useCustomToast } from "~/shared/composables/useCustomToast";
import type {
  JsonSerializable,
  ResponsePagination,
} from "~/shared/types/core/request.types";
import type { TableViewHeaderColumn } from "~/shared/types/ui/table-view.types";
import { mapPagination } from "~/shared/utils/core/mapPagination";
import { objectToQueryString } from "~/shared/utils/core/objectToQueryString";
import { showRequestError } from "~/shared/utils/core/show-request-error";

function useAdminUsersData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_COLUMNS: TableViewHeaderColumn[] = [
    { prop: "name", label: "Имя", minWidth: 150 },
    { prop: "email", label: "Email", minWidth: 200 },
    { prop: "is_admin", label: "Админ", width: 100 },
    { prop: "blocked_at", label: "Статус", width: 140 },
    { prop: "created_at", label: "Дата создания", width: 180 },
    { prop: "actions", label: "Действия", fixed: "right", width: 120 },
  ];

  const { toastError } = useCustomToast();

  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const loading = ref(false);
  const data = ref<AdminUser[]>([]);

  const getData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      } as Record<string, JsonSerializable>);

      const response = await getAdminUsers(params);

      data.value = response.data;
      meta.value = mapPagination(response.meta.pagination);
    } catch (e) {
      toastError("Ошибка при получении пользователей");
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    TABLE_COLUMNS,
    loading,
    data,
    meta,
    getData,
  };
}

export default useAdminUsersData;
