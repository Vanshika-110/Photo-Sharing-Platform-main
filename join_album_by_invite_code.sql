create or replace function public.join_album_by_invite_code(p_invite_code text)
returns table (album_id uuid, joined boolean)
language plpgsql
security definer
set search_path = ''
as $function$
declare
    v_user_id uuid := auth.uid();
    v_album_id uuid;
    v_owner_id uuid;
    v_joined boolean := false;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    if nullif(btrim(p_invite_code), '') is null then
        return;
    end if;

    select a.id, a.owner_id
    into v_album_id, v_owner_id
    from public.albums as a
    where upper(btrim(a.invite_code)) = upper(btrim(p_invite_code))
    limit 1
    for update;

    if not found then
        return;
    end if;

    if v_owner_id <> v_user_id
       and not exists (
           select 1
           from public.album_members as m
           where m.album_id = v_album_id
             and m.user_id = v_user_id
       ) then
        insert into public.album_members (album_id, user_id)
        values (v_album_id, v_user_id);
        v_joined := true;
    end if;

    return query select v_album_id, v_joined;
end;
$function$;

revoke all on function public.join_album_by_invite_code(text) from public, anon, authenticated;
grant execute on function public.join_album_by_invite_code(text) to authenticated;
