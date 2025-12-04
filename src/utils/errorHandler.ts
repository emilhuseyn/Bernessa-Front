interface FormattedApiError {
  status?: number;
  data?: { message?: string; [key: string]: unknown } | null;
  message?: string;
  request?: unknown;
  response?: { status?: number; data?: { message?: string } };
}

export const handleApiError = (error: unknown): string => {
  const formatted = error as FormattedApiError;
  const status = formatted?.status ?? formatted?.response?.status;
  const message =
    formatted?.data?.message ??
    formatted?.response?.data?.message ??
    formatted?.message ??
    (typeof error === 'string' ? error : undefined);

  if (status) {
    switch (status) {
      case 400:
        return 'Yanlış məlumat göndərildi';
      case 401:
        return 'Giriş tələb olunur';
      case 403:
        return 'Bu əməliyyata icazəniz yoxdur';
      case 404:
        return 'Məlumat tapılmadı';
      case 500:
        return 'Server xətası';
      default:
        return message || 'Xəta baş verdi';
    }
  }

  if ((formatted as any)?.request) {
    return 'Serverə qoşulmaq mümkün olmadı';
  }

  return message || 'Naməlum xəta';
};
